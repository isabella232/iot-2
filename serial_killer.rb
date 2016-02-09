require File.expand_path('../app/client.rb', __FILE__)
require File.expand_path('../app/device.rb', __FILE__)

port = ARGV[0] || '/dev/tty.usbmodemFA131'

device = Device.new(port)
client = Client.new('http://localhost:3000/iot')

while true do
  if data = device.read
    client.pub(data)
  end
end
