require 'json'
require 'rubyserial'

require File.expand_path('../db.rb', __FILE__)

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
      s[3] = [0, (1.3 * (s[3] / 10) - 70)].max #luminosity

      persist(s)

      s.map{|d| '%.2f' % d }
    else
      nil
    end
  end

  protected
    def persist(data)
      j = COLUMNS.zip(data).inject({}){ |h, v| h.tap { h[v[0]] = v[1] } }

      DB.instance.exec("INSERT INTO data(values) VALUES('" + JSON.dump(j) + "')")
    end
end
