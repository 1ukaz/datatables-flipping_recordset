# Flipping a Recordset

Use this application to quickly test Lucas Guegnolle's (Limited) Skills.

This application is a small widget to embed via AJAX in any Site.

I made it because I was challenged to display a recordset from DDBB but:
- I should use every key as a row header.
- Every date in the following per key collections should be convert into column.
- Missing days had to be filled up with zeroes.
- Meanning that the recordset had to be flipped (Take a look at the JSON and will figure)

## Install the Application

* Clone this Repository: `git clone https://github.com/1ukaz/datatables-flipping_recordset.git`

* Get inside the folder where you cloned into: Defaults to `datatables-flipping_recordset`

## Run it!

* You will need to run it under some sort of Web Server, since ti performs an AJAX call to do the loading.

* Execute `php -S 127.0.0.1:8100` to run PHP Built in Server for instance, or you can run a NodeJS Server.

* Go ahead with the Browser and hit: `http://127.0.0.1:8100`. You should see the Datatable Grid.

* That's it! Now go and hire the poor devil!

## Notes

* This project is released under the GNU License for Open Source products.
* You can customi(s|z)e this in any way you need to.
* Improvement suggestions are always welcome!
