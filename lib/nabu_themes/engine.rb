module NabuThemes
  class Engine < ::Rails::Engine
    isolate_namespace NabuThemes
    #config.to_prepare do
    #  ApplicationController.helper(ActionView::Helpers::ApplicationHelper)
    #end
  end
end
