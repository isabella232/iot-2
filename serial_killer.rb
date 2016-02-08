require File.expand_path('../app/client.rb', __FILE__)
require File.expand_path('../app/device.rb', __FILE__)

device = Device.new('/dev/tty.usbmodemFD121', 115200, 8)
client = Client.new('http://localhost:3000/iot')

while true do
  if data = device.read
    client.pub(data)
  end
end
