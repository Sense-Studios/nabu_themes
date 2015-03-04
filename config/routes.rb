NabuThemes::Engine.routes.draw do
  
  # menu (set) management
  resources :menus  
  
  # theme management
  resources :themes  
  
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
