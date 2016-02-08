require 'rubygems'
require 'bundler/setup'

use Rack::Static, :urls => ['/stylesheets', '/javascripts'], :root => 'app/assets'

require File.expand_path('../app', __FILE__)


Faye::WebSocket.load_adapter('thin')

run App

