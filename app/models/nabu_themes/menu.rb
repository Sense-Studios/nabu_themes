module NabuThemes
  class Menu
    include Mongoid::Document
    include Mongoid::Timestamps
    belongs_to :theme
    field :name, type: String
    field :items, type: String, default: '{ "menu":[ { "name" : "New Category", "items" : [] } ] }'
    field :config, type: String, default: '{}'
    field :owner, type: User
  end
end
