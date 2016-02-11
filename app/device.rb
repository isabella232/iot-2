require 'json'
require 'rubyserial'

require File.expand_path('../db.rb', __FILE__)

class Device
  attr_accessor :port, :rate
  attr_reader :serialport

  FAKE_COLUMNS = {
    ph: (6.2..6.6),
    co2: (35.0..45.0),
    no2: (0.0..40.0),
    soil_moisture: (0.0..100.0),
    radiation: (0.0..1.0)
  }

  TABULABLE_COLUMNS   = [:temperature, :pressure, :humidity, :luminosity, :wind]
  UNTABULABLE_COLUMNS = [:wind_direction]

  COLUMNS = TABULABLE_COLUMNS + UNTABULABLE_COLUMNS

  ALL_COLUMNS = COLUMNS + FAKE_COLUMNS.keys

  def self.column_names
    (ALL_COLUMNS).map{|c| c.to_s.gsub(/_/, ' ').capitalize} 
  end

  def initialize port, rate = 115200, bits = 8
    @port = port
    @rate = rate
    @bits = bits

    @serialport = Serial.new port, rate, bits
  end

  def read
    r    = Random.new
    data = @serialport.gets("\n").strip

    if (s = data.split(';').compact.map(&:to_f)).size == COLUMNS.size
      s[1] = (s[1] * 0.007500617) / 10 #pressure
      s[3] = s[3] / 10 #luminosity

      FAKE_COLUMNS.each{|_,d| s << r.rand(d) }

      persist(s)

      s.map{d| '%.2f' % d }
    else
      nil
    end
  end

  protected
    def persist(data)
      j = ALL_COLUMNS.zip(data).inject({}){ |h, v| h.tap { h[v[0]] = v[1] } }

      DB.instance.exec("INSERT INTO data(values) VALUES('" + JSON.dump(j) + "')")
    end
end
