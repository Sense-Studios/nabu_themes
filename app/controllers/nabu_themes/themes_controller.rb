require_dependency "nabu_themes/application_controller"

module NabuThemes
  class ThemesController < ApplicationController
    before_action :set_theme, only: [:show, :edit, :update, :destroy]
    layout "layouts/admin"    

    # check and find a slug, then find the themeuser and fill # the theme
    # note that slug checking is done in the routes
    def render_theme      

      # lookup slug, and get owner and id info
      @theme = Theme.where( { "slug"=>params[:slug] } ).first()
      @owner = User.find( @theme.owner )   # agrimedia

      @programs = MarduqResource::Program.where( "client_id" => @owner.client_id )
      @program = MarduqResource::Program.find( @theme.home_program )

      @menudata = @owner.menu # menu.find @theme.menu_id
      @items = @programs[0..4] # remove this (relic of the sense theme )
      @categories = [ "dikke", "piemel", "drie", "bier"] # remove this, no function

      begin
        render 'nabu_themes/' + @theme.theme + '/index', :layout => "nabu_themes/" + @theme.theme + "/" + @theme.theme
      rescue
        render 'nabu_themes/' + @theme.theme + '/index', :layout => "nabu_themes/application"
      end

    end
    
    # GET /themes
    def index
      @themes = Theme.all
    end

    # GET /themes/1
    def show
    end

    # GET /themes/new
    def new
      @theme = Theme.new
    end

    # GET /themes/1/edit
    def edit
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
      # Use callbacks to share common setup or constraints between actions.
      def set_theme
        @theme = Theme.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def theme_params
        params.require(:theme).permit(:title, :description, :about, :contact, :slug, :owner, :home_program, :theme, :logo, :main_color, :support_color, :settings )
      end

  end
end
