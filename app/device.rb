require 'rubyserial'

class Device
  attr_accessor :port, :rate
  attr_reader :serialport

  COLUMNS = [:temperature, :humidity, :light, :preasure, :wind]

  def initialize port = '/dev/tty.usbmodemFD121', rate = 115200, bits = 8
    @port = port
    @rate = rate
    @bits = bits

    @serialport = Serial.new port, rate, bits
  end

  def read
    data = @serialport.gets("\n").strip

    if (s = data.split(';').compact).size == COLUMNS.size
      s[1] = s[1].to_f / 1000
      s
    else
      nil
    end
  end
end
