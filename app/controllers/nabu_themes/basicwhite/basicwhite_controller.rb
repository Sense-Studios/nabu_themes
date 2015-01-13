require_dependency "nabu_themes/application_controller"

module NabuThemes
  class Basicwhite::BasicwhiteController < ApplicationController

    # otherwise it uses its own
    layout 'nabu_themes/application'  

    # before_action :menu_items

    def index
      # @owner = User.find("538c84d864657614b7010000")
      # @owner = User.find("538c84d864657614b7010000") # daan
      @owner = User.find("53bfbc2a6465763aa2f83a00")   # agrimedia
      @menudata = @owner.menu
      @programs = MarduqResource::Program.all
      @program = MarduqResource::Program.find("548ac7656465764c03010000")
      # MarduqResource::Program.last

      # Why do I need to force this, If I just don't want directories like
      # nabu_themes/basicwhite/basicwhite/index
      render "nabu_themes/basicwhite/index"
    end
  end
end
