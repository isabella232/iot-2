require 'faye'
require 'eventmachine'

class Client
  attr_accessor :em_thread, :client

  def initialize url = 'http://localhost:3000/iot'
    self.em_thread = Thread.new do
      EM.run
    end
    self.client = Faye::Client.new(url)
  end

  def pub data
    publication = client.publish('/sensor', data: data)
    puts "Publishing"

    publication.callback do
      puts "Published"
    end
    publication.errback do |error |
      puts error.inspect
      EM.stop_event_loop
    end
  end
end
