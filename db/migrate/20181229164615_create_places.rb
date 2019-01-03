class CreatePlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :places do |t|
      t.string :place_id
      t.string :place_name
      t.string :city
      t.string :street
      t.string :street_no
      t.string :open_hours

      t.timestamps
    end
  end
end
