require 'sinatra'
require 'faye'
require 'haml'

require File.expand_path('../app/device.rb', __FILE__)

ROOT_DIR = File.expand_path('..', __FILE__)
set :root, ROOT_DIR
set :logging, false
set :views, Proc.new { File.join(root, "app/views") }

get '/' do
  haml :index
end

get '/post' do
  env['faye.client'].publish('/mentioning/*', {
    :user => 'sinatra',
    :message => params[:message]
  })
  params[:message]
end


App = Faye::RackAdapter.new(Sinatra::Application,
  :mount   => '/iot',
  :timeout => 25
)

def App.log(message)
end

App.on(:subscribe) do |client_id, channel|
  puts "[  SUBSCRIBE] #{client_id} -> #{channel}"
end

App.on(:unsubscribe) do |client_id, channel|
  puts "[UNSUBSCRIBE] #{client_id} -> #{channel}"
end

App.on(:disconnect) do |client_id|
  puts "[ DISCONNECT] #{client_id}"
end

App.on(:publish) do |client_id, channel, data|
  puts "[ PUBLISH] #{client_id}, #{channel} => #{data}"
end


