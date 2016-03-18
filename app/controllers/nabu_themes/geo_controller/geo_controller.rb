require_dependency "nabu_themes/application_controller"

module NabuThemes
  class Geo::GeoController < ApplicationController

    # set to application or remove to let it use its own layout in layout/geo
    layout 'nabu_themes/application'

    # before_action :menu_items

    # geo is loaded directly through the theme controller
    def index
    end
  end
end
