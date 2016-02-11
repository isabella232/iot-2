require File.expand_path('../device.rb', __FILE__)

class FakeDevice < Device

  def initialize
    r = Random.new

    @data = [r.rand(360.0)] * COLUMNS.length
    FAKE_COLUMNS.each_with_index{|(_,d), i| @data[COLUMNS.size + i] = r.rand(d) }
  end

  def read
    r = Random.new

    COLUMNS.each_with_index do |c, i|
      d = @data[i] += [1, -1][r.rand(2)] * r.rand(10.0)

      @data[i] = 0 if d > 360 || d < 0
    end

    FAKE_COLUMNS.each_with_index do |(_,v), i|
      d = @data[COLUMNS.size + i] += [1, -1][r.rand(2)] * r.rand(0.1)

      @data[COLUMNS.size + i] = r.rand(v) if d > v.last || d < v.first
    end

    persist(@data)

    @data.map{|d| '%.2f' % d }
  end
end
