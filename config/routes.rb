NabuThemes::Engine.routes.draw do
# Rails.application.routes.draw do  # NOT MyEngineName::Engine.routes.draw
  
  # theme management
  resources :themes  

  # check if the slug is available
  get '/(:slug)', to: 'themes#render_theme' , constraints: lambda { |request| NabuThemes::Theme.all.pluck(:slug).include?( request.params['slug'] ) }

  # basic white theme
  namespace 'basicwhite' do
    get '/', to: "basicwhite#index"
  end
  
  # sense theme
  namespace 'sense' do
    get '/', to: 'sense#index'
    get 'showcases(/:tag)', to: 'sense#showcases', as: :showcases
    get 'showcase/:id', to: 'sense#showcase', as: :showcase
    get 'about', to: 'sense#about'
    get 'clients', to: 'sense#clients'
    get 'contact', to: 'sense#contact'
    get 'news', to: 'sense#news'
    get 'frontpage-embed/:id', to: 'sense#embed', as: :frontpage_embed
  end
  
  # something with slugs?
  # get "/(:slug)", to: "themes#find_slug"
  
end
