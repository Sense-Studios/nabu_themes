# local settings for the engine
# give it 00 prefix so this file is executed first

# mount point
# NABU_THEMES_MOUNT_POINT = "theme"
NABU_THEMES_MOUNT_POINT = "channel"

# available themes
NABU_THEMES_AVAILABLE_THEMES = [ "babylon", "ur", "sense","geo", "geo2", "clipcard", "mixer", "oculus" ]
 # "sense", "babylon", "basicwhite", "destandaard", "gazetvanantwerpen", oculus
 # clipcard",
 # "oculus",

# create extra menu items
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Nabu Channels", "header" => true } )
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Menus", "link" => "/channel/menus", "glyphicon" => "glyphicon-list" } )
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Channels", "link" => "/channel/themes", "glyphicon" => "glyphicon-cog" } )
