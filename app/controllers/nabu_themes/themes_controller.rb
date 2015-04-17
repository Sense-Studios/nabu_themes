require_dependency "nabu_themes/application_controller"

module NabuThemes
  class ThemesController < ApplicationController
    before_action :set_theme, only: [:show, :edit, :update, :destroy]
    before_filter :authenticate_user!, except: [:render_theme]
    layout "layouts/admin"

    # check and find a slug, then find the themeuser and fill # the theme
    # note that slug checking is done in the routes
    def render_theme

      @slug = params[:slug]
      @theme = Theme.where( { "slug"=>params[:slug] } ).first()
      @menudata = NabuThemes::Menu.find( @theme.menu ).items
      if params[:id].blank?
        @program = MarduqResource::Program.find( @theme.home_program ) # home program
      else
        @program = MarduqResource::Program.find( params[:id] ) # home program
      end

      @programs = MarduqResource::Program.where( "client_id" => User.find( @theme.owner ).client_id )
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

    private
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

  end
end
