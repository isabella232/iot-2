require File.expand_path('../device.rb', __FILE__)

class FakeDevice < Device

  def self.read
    Device::COLUMNS.map do |c|
      if c == :wind_direction
        Random.new.rand(360.0)
      else
        Random.new.rand(100.0)
      end
    end
  end
end
