require_dependency "nabu_themes/application_controller"

module NabuThemes
  class ThemesController < ApplicationController
    before_action :set_theme, only: [:show, :edit, :update, :destroy]
    before_filter :authenticate_user!, except: [:render_theme]
    after_action :allow_iframe, only: [:render_theme, :show]
    layout "layouts/admin"

    # check and find a slug, then find the themeuser and fill # the theme
    # note that slug checking is done in the routes
    def render_theme

      @slug = params[:slug]
      @theme = Theme.where( { "slug"=>params[:slug] } ).first()
      @channelsettings = @theme.settings
      @menuconfig = NabuThemes::Menu.find( @theme.menu ).config
      @menudata = NabuThemes::Menu.find( @theme.menu ).items

      if params[:id].blank?
        if @theme.home_program.blank?
          @program = appMarduqResource::Program.find( JSON.parse( Menu.find(@theme.menu).items)["menu"][0]["items"][0]["id"] )
        else
          @program = MarduqResource::Program.find( @theme.home_program ) # home program
         end

      else
        @program = MarduqResource::Program.find( params[:id] ) # any id
      end

      owner = User.find( @theme.owner )
      @programs = MarduqResource::Program.where( "client_id" => owner.client_id )
      @kalturaPartnerId = owner.kaltura_partner_id
      @kalturaUiConfigId = owner.kaltura_uiconfig_id
      @filtered_programs = @programs.map do |program|
        md = program.meta.moviedescription
        { id: program.id, title: program.title, tags: program.tags, created_at: program.created_at, meta: { moviedescription: { duration_in_ms: md.try(:duration_in_ms), thumbnail: md.try(:thumbnail) } } }
      end

      #.pluck( title, meta.to_json().moviedescription.duration_in_ms, created_at, meta.moviedescription.thumbnail)
      @page = 'nabu_themes/' + @theme.theme + '/index'
      @related_programs = @programs.select { |p| p.tags.any? { |t| @program.tags.include? t } }
      @related_programs = @programs if @related_programs.blank?

      # get a page if supplied
      if !params[:page].blank?
        @page = 'nabu_themes/' + @theme.theme + '/' + params[:page].to_s
      end

      begin
        # try for the layout in /theme directory/layout/theme
        render @page, :layout => "nabu_themes/" + @theme.theme + "/" + @theme.theme
      rescue
        # render the default layout
        render @page, :layout => "nabu_themes/application"
      end
    end

    # GET /themes
    def index
      get_account_owner
      @themes = Theme.where( :owner => @account_id )
      respond_to do |format|
        format.html
        format.json{
          render :json => @themes.to_json
        }
      end
    end

    # GET /themes/1
    def show
      #format.json render json: @theme
      respond_to do |format|
        format.html
        format.json{
          render :json => @theme.to_json
        }
      end
    end

    # GET /themes/new
    def new
      get_account_owner
      @menus = NabuThemes::Menu.where( :owner => @account_id )
      @programs = MarduqResource::Program.where( "client_id" => User.find( @owner ).client_id )
      @theme = Theme.new
    end

    # GET /themes/1/edit
    def edit
      get_account_owner
      @owner = User.find( @theme.owner )
      @menus = NabuThemes::Menu.where( :owner => @account_id )
      @programs = MarduqResource::Program.where( "client_id" => @owner.client_id )
    end

    # POST /themes
    def create
      @theme = Theme.new(theme_params)
      if @theme.save
        redirect_to @theme, notice: 'Theme was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /themes/1
    def update
      if @theme.update(theme_params)
        redirect_to @theme, notice: 'Theme was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /themes/1
    def destroy
      @theme.destroy
      redirect_to themes_url, notice: 'Theme was successfully destroyed.'
    end


    #########################################################################
    # FOR API, should go for some kind of xhr or json, but I have little time
    #########################################################################

    def create_theme_api
      @theme = Theme.new( theme_params )
      get_account_owner
      @theme.owner = @account_id

      if hasDupes( params )
        render json: { "status"=> "fail", "message" => "either the slug or the title was a duplicate" }
        logger.debug " >>> KON THEMA NIET MAKEN, HAS DUPES"
        return false
      end

      if @theme.save
        render json: @theme
      else
        render json: { "status"=>"fail", "message" => "there was an error creating the theme"}
      end
    end

    def update_theme_api
      if hasDupes( params )
        render json: { "status"=> "fail", "message" => "either the slug or the title was a duplicate" }
        return
      end

      @theme = Theme.find( params[:id] )
      if @theme.update( theme_params )
        render json: { "status"=> "ok", "message" => "theme was succesfully updated" }
      else
        render json: { "status"=> "error updating theme"}
      end
    end

    def delete_theme_api
      @theme = Theme.find( params[:id] )
      if @theme.destroy
        render json: { "status"=> "ok", "message" => "theme destroyed" }
      else
        render json: { "status"=> "fail", "message" => "error updating theme" }
      end
    end

    # PRIVATE, Stop reading!
    private
      def hasDupes( p )
      	logger.debug "check for slugs "
      	logger.debug p.inspect
      	logger.debug "---------------"

        if p[:theme][:slug].blank? || p[:theme][:title].blank?
          logger.debug "leeg gelaten"
          return true
        end

        hasRecord = Theme.where( :id.ne => p[:id], :slug=> p[:theme][:slug] ).count
        logger.debug "has records: "
        logger.debug hasRecord
        logger.debug "---------------"

        if hasRecord > 0
          return true
        else
          return false
        end
      end

      def get_account_owner
        # find owner and account id through clipcard
        @owner = current_user
        if !@owner.account_id.nil?
          @account_id = User.find( @owner.id ).account_id
        else
          @account_id = @owner.id
        end
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_theme
        @theme = Theme.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def theme_params
        params.require(:theme).permit(:title, :description, :about, :contact, :slug, :owner, :home_program, :theme, :menu, :logo, :main_color, :support_color, :background_color, :settings )
      end

      def allow_iframe
        response.headers.except! 'X-Frame-Options'
      end
  end
end
