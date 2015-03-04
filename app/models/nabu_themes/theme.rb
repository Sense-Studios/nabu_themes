module NabuThemes
  class Theme
    include Mongoid::Document
    include Mongoid::Timestamps

    # not sure if I need these releations
    # has_many MarduqResource::Programs

    field :title, type: String                          # name of theme

    field :description, type: String
    field :about, type: String
    field :contact, type: String

    field :slug, type: String                           # name of theme/owner combination for url
    field :owner, type: User                            # id of account owner
    field :menu, type: Menu                             # id of the menu asociated with this instance of the theme
    field :home_program, type: MarduqResource::Program  # home program
    field :theme, type: String                          # from drop down (?)

    field :logo, type: String                           # as url on aws
    
    # these colors are nice, but kind of a relic,
    # I'm actually in favour of doing this through the settings
    field :main_color, type: String                     # as color in hex
    field :support_color, type: String                  # as color in hex
    field :background_color, type: String               # an extra color to serve as hover and background in hex
    
    field :settings, type: String                       # as json string
  end
end