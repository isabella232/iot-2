require 'rubyserial'

class Device
  attr_accessor :port, :rate
  attr_reader :serialport

  TABULABLE_COLUMNS = [:temperature, :pressure, :humidity, :luminosity, :wind]
  UNTABULABLE_COLUMNS = [:wind_direction]
  COLUMNS = TABULABLE_COLUMNS + UNTABULABLE_COLUMNS

  def initialize port, rate = 115200, bits = 8
    @port = port
    @rate = rate
    @bits = bits

    @serialport = Serial.new port, rate, bits
  end

  def read
    data = @serialport.gets("\n").strip

    if (s = data.split(';').compact.map(&:to_f)).size == COLUMNS.size
      s[1] = (s[1] * 0.007500617) / 10 #pressure
      s[3] = s[3] / 10 #luminosity

      s.map{|d| '%.2f' % d }
    else
      nil
    end
  end
end
