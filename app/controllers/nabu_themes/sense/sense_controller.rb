require_dependency "nabu_themes/application_controller"

module NabuThemes
  class Sense::SenseController < ApplicationController

    before_action :menu_items
    layout 'nabu_themes/sense/sense'  

    def index
      @owner = User.find("53bfbc2a6465763aa2f83a00")   # agrimedia
      @menudata = @owner.menu
      @programs = MarduqResource::Program.all
      @program = MarduqResource::Program.find("548ac7656465764c03010000")
      @items = @programs[10..14]
      @categories = ["boer", "zoekt", "vrouw"]
 
      render 'nabu_themes/sense/index'  
    end
    
    def menu_items
    end
    
    def showcase
    end

  end
end
