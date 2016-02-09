require File.expand_path('../app/client.rb', __FILE__)
require File.expand_path('../app/fake_device.rb', __FILE__)

client = Client.new('http://localhost:3000/iot')

device = FakeDevice.new

while true do
  data = device.read

  client.pub(data)

  sleep 1
end

