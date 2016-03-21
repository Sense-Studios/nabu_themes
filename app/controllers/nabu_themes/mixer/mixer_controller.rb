require_dependency "nabu_themes/application_controller"

module NabuThemes
  class Mixer::MixerController < ApplicationController
    layout 'nabu_themes/sense/sense'

    def index
      @channelsettings "{'foo':'bar'}"
    end

    def test
    end
  end
end
