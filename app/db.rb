require 'pg'
require 'singleton'

class DB
  include Singleton

  def initialize
    @connection =PG.connect( dbname: 'iot' ) 
  end

  def exec query
    @connection.exec(query)
  end
end
