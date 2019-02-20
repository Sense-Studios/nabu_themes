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

      set_whitelabel

      # ensure backward compatibility
      if params[:page] == "p2v"
        params[:id] = nil
        params[:page] = nil
      end

      @slug = params[:slug]
      @theme = Theme.where( { "slug"=>params[:slug] } ).first()
      if @theme.settings.blank?
        @theme.settings = '{"warning":"no_settings"}'
      end

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

      # TEST !
      # for CLIPCARD functionality
      begin
        if !JSON.parse(@channelsettings)['clipcard_id'].nil?
          @clipcard = Clipcard.find(JSON.parse(@channelsettings)['clipcard_id'])
          @highscores = Carder.where(:clipcard_id => JSON.parse(@channelsettings)['clipcard_id'] ).sort(:total_score => -1).to_a
        end
      rescue
        logger.debug "json could not be parsed by ruby"
      end

      @owner = User.find( @theme.owner )
      @kalturaPartnerId = @owner.kaltura_partner_id
      @kalturaUiConfigId = @owner.kaltura_uiconfig_id
      @programs = MarduqResource::Program.where( "client_id" => @owner.client_id )

      @filtered_programs = @programs.map do |program|
        md = program.meta.moviedescription
        ass = "no assets found"
        ass = program.program_items[0].asset unless program.program_items[0].nil?
        {
          id: program.id,
          title: program.title,
          description: program.description,
          tags: program.tags,
          created_at: program.created_at,
          assets: ass,
          thumbnail: md.try(:thumbnail),
          meta: {
            moviedescription: {
              duration_in_ms: md.try(:duration_in_ms),
              thumbnail: md.try(:thumbnail)
            }
          }
        }
      end

      #.pluck( title, meta.to_json().moviedescription.duration_in_ms, created_at, meta.moviedescription.thumbnail)
      @page = 'nabu_themes/' + @theme.theme + '/index'
      @related_programs = @programs.select { |p| p.tags.any? { |t| @program.tags.include? t } }
      @related_programs = @programs if @related_programs.blank?

      # get a page if supplied
      if !params[:page].blank?
        @page = 'nabu_themes/' + @theme.theme + '/' + params[:page].to_s
      end

      #begin
        # try for the layout in /theme directory/layout/theme
        render @page, :layout => "nabu_themes/" + @theme.theme + "/" + @theme.theme + ".html.haml"
      #rescue Exception => e
        # render the default layout
      #  logger.debug " HERE IS THE ERROR: #{e}"
      #  render @page, :layout => "nabu_themes/application"
      #end
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

    # MOVIETRADER clipcard functionality
    # clipcard
    def clipcard

      params[:id] = 'pika'

      if params[:id]
        @clipcard = Clipcard.find params[:id] rescue nil
        if @clipcard.nil?  # not found by id, try to find one by slug
          @clipcard = Clipcard.find_by( :slug => params[:id] )
        end
        @highscores = Carder.where(:clipcard => params[:id]).sort(:total_score => -1).to_a

        # find owner and account id through clipcard
        @owner = User.find( @clipcard.client_id )
        if !@owner.account_id.nil?
          @owner = User.find( @owner.id )
          @account_id = @owner.account_id
        else
          @account_id = @owner.id
        end

        logger.debug params.inspect

        if @clipcard.password.present?
          @validated = false
          if params[:password] and params[:password]==@clipcard.password
            @validated = true
          end
        else
          @validated = true
        end
      end

      # Check for cookie?
      #@carder = Carder.where({:name => params[:email], :email => params[:email]})
      #if @carder.nil?
      #
      #end
      @carder = Carder.new()
      # render layout: "clipcards"
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

      def allow_iframe
        response.headers.except! 'X-Frame-Options'
      end

      def set_whitelabel

        # match url with labls
        current_domain = request.host_with_port
        current_whitelabel = 0
        WHITELABELS.each_with_index do |w, i|
          w["domains"].each do |d|
            if d == current_domain
              current_whitelabel = i
            end
          end
        end
        @whitelabel = WHITELABELS[current_whitelabel]
      end

      # Only allow a trusted parameter "white list" through.
      def theme_params
        params.require(:theme).permit(:title, :description, :about, :contact, :slug, :owner, :home_program, :theme, :menu, :logo, :main_color, :support_color, :background_color, :settings )
      end
  end
end
