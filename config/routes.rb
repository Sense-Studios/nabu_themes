NabuThemes::Engine.routes.draw do
  
  # menu (set) management
  resources :menus  
  post 'menu_api/create', to: 'menus#create_menu_api'
  post 'menu_api/update(/:id)', to: 'menus#update_menu_api'
  post 'menu_api/delete(/:id)', to: 'menus#delete_menu_api'

  
  # theme management
  resources :themes 
  
  # themes and chennels are identical
  # but I'm routing both, as we've changed
  # the naming convention later on 
  post 'theme_api/create', to: 'themes#create_theme_api'
  post 'theme_api/update(/:id)', to: 'themes#update_theme_api'
  post 'theme_api/delete(/:id)', to: 'themes#delete_theme_api'
  post 'channel_api/create', to: 'themes#create_theme_api'
  post 'channel_api/update(/:id)', to: 'themes#update_theme_api'
  post 'channel_api/delete(/:id)', to: 'themes#delete_theme_api'
  
  # check if the slug is available and open it, else go on with the list
  get '/(:slug)(/:page)(/:id)', to: 'themes#render_theme' , constraints: lambda { |request| NabuThemes::Theme.all.pluck(:slug).include?( request.params['slug'] ) }

  # basic white theme
  # namespace 'basicwhite' do
  #   get '/', to: "basicwhite#index"
  # end
  
  # sense theme, will be deleted as the site gets modernized
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

end
