require_dependency "nabu_themes/application_controller"

module NabuThemes
  class MenusController < ApplicationController
    before_action :set_menu, only: [:show, :edit, :update, :destroy]
    layout "layouts/admin"   

    # ajax/post (not used currently)
    def menu_update
      # params[:menu]
      # = array
      # current_user // add the menu to current users owner (!)
      # this is now routed through the admin mode, this needs to
      # be re-written to work with a new structure
      logger.debug "---------------------------"
      logger.debug "Has account"
      logger.debug "> " + current_user.id
      logger.debug "> " + current_user.client_id
      logger.debug "---------------------------"
      logger.debug "you are posting le menu update!"
      logger.debug params[:menu]

      # depricated, menus have their own id
      # so all we need is a menu-id and update the items of that
      # but for now, this is also handled through the menu/update
      
      # save it
      # owner = User.find( current_user.client_id )
      # owner.menu = params[:menu]
      # owner.save
      
      render :text => "Depricated"
    end
    
    # original menu editor
    # get
    def menu_editor
      # @programs = MarduqResource::Program.all
      @programs = MarduqResource::Program.where(client_id: current_user.client_id) || []
      
      # change this part to work with and like a scaffold
      # menus will be seperate entities, joining in a 
      # has_many/ belongs_to channel or theme 
      u = User.find( current_user.client_id )
      @menu_data = u.menu
    end
    
    # GET /menus
    def index
      get_account_owner
      @menus = Menu.where( :owner => @account_id )
    end

    # GET /menus/1
    def show
    end

    # GET /menus/new
    def new
      get_account_owner      
      @menu = Menu.new
      @menu.owner = @account_id
    end

    # GET /menus/1/edit
    def edit      
      @programs = MarduqResource::Program.where(client_id: current_user.client_id) || []
      @menu_data = @menu.items
    end

    # POST /menus
    def create
      @menu = Menu.new(menu_params)
      get_account_owner
      @menu.owner = @account_id

      if @menu.save                
        redirect_to edit_menu_path(@menu), notice: 'Menu was successfully created.'
      else
        render action: 'new'
      end
    end

    # PATCH/PUT /menus/1
    def update
      if @menu.update(menu_params)
        redirect_to @menu, notice: 'Menu was successfully updated.'
      else
        render action: 'edit'
      end
    end

    # DELETE /menus/1
    def destroy
      @menu.destroy
      redirect_to menus_url, notice: 'Menu was successfully destroyed.'
    end

    private
      def get_account_owner
        # find owner and account id through clipcard
        @owner = current_user
        if !@owner.account_id.nil?
          @account = User.find( @owner.id )
          @account_id = @account.account_id 
        else
          @account = @owner
          @account_id = @owner.id
        end
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_menu
        @menu = Menu.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def menu_params
        params.require(:menu).permit(:name, :items)
      end
  end
end
