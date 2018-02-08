require_dependency "nabu_themes/application_controller"

module NabuThemes
  class Sense::SenseController < ApplicationController
    layout 'nabu_themes/sense/sense'

    def mixer3
      layout false
    end
  end
end
