$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "nabu_themes/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "nabu_themes"
  s.version     = NabuThemes::VERSION
  s.authors     = ["Daan Nolen, Sense"]
  s.email       = ["daan@sense-studios.com"]
  s.homepage    = "http://www.sense-studios.com"
  s.summary     = "Adds themes and frontends to the marduq/nabu master system"
  s.description = "Stuff"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  # s.add_dependency "rails", "~> 4.0.3"
  # s.add_dependency "jquery-rails"
  s.add_dependency "mongoid"
end
