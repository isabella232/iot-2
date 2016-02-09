require File.expand_path('../app/client.rb', __FILE__)
require File.expand_path('../app/fake_device.rb', __FILE__)

port = ARGV[0] || '/dev/tty.usbmodemFA131'

client = Client.new('http://localhost:3000/iot')

while true do
  data = FakeDevice.read

  client.pub(data)

  sleep 1
end

