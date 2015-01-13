module NabuThemes
  class Theme
    include Mongoid::Document
    include Mongoid::Timestamps

    # not sure if I need these releations
    # belongs_to user
    # has_many MarduqResource::Programs

    field :title, type: String                          # name of theme

    field :description, type: String
    field :about, type: String
    field :contact, type: String

    field :slug, type: String                           # name of theme/owner combination for url
    field :owner, type: User                            # id of account owner
    field :home_program, type: MarduqResource::Program  # home program
    field :theme, type: String                          # from drop down (?)

    field :logo, type: String                           # as url on aws
    field :main_color, type: String                     # as color in hex
    field :support_color, type: String                  # as color in hex, #FFFFFF
    field :settings, type: String                       # as json string
  end
end