require File.expand_path('../device.rb', __FILE__)

class FakeDevice < Device

  def initialize
    @data = [Random.new.rand(360.0)] * COLUMNS.length
  end

  def read
    r = Random.new

    COLUMNS.each_with_index do |c, i|
      d = @data[i] += [1, -1][r.rand(2)] * r.rand(10.0)

      @data[i] = 0 if d > 360 || d < 0
    end

    persist(@data)

    @data.map{|d| '%.2f' % d }
  end
end
