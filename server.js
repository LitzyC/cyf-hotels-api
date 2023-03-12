const express = requiere ("express");
const app = express();

//app.listen (port:3000, hostname:function);

// express - http
app.get("/hotels", function (req, res) {
    let optionalHotelName = req.query.hotelName;
​
    if (optionalHotelName) {
        pool.query(findHotelByLike, ['%' + optionalHotelName + '%'], (error, result) => {
            if (result.rows.length == 0) {
                res.send(`No existe ningun hotel con nombre ${optionalHotelName}`);
            } else {
                res.json(result.rows);
            }
        });
    } else {
​
        pool.query(readAllHotels, (error, result) => {
            // result contiene el resultado de la SQL: Todas las filas con sus columnas
            // res es la respuesta al fetch. Transforma las filas SQL en un JSON
            res.json(result.rows);
        });
    }
});
​
app.get("/hotels/:idHotel", function (req, res) {
    let hotelId = req.params.idHotel;
​
    pool.query(findHotelById, [hotelId], (error, result) => {
        if (result.rows.length === 0) {
            res.send(`No existe ningun hotel con id ${hotelId}`);
        } else {
            res.json(result.rows);
        }
​
    })
});

app.post('/hotels/:hotelId', (req, res) => {
    let hotelId = req.params.hotelId
    let newHotelName = req.body.name
​
    // TODO Add a validation to prevent duplicated names as we did for inserts
​
    // TODO Validate that the id is valid
​
    pool
        .query(updateExistingHotelName, [newHotelName, hotelId])
        .then(
            res.send('Hotel updated con el nombre ' + newHotelName)
        )
        .catch(e => {
            console.log(e)
            res.send('Error al updatear el hotel')
        })
})

app.delete('/hotels/:hotelId', (req, res) => {
    let hotelId = req.params.hotelId

    //delete from bookings where hotelId=$1
    pool
        .query(deleteExistingHotelName, [hotelId])
        .then(res.send('Hotel has been deleted'))
        .catch(e => {
            console.log(e)
            res.send('Error al eliminar el hotel')
        })
​
    // TODO Is going to work with id 1? Eliminar reservas primero.

});


app.put("/hotels", (req, res) => {
    let hotelName = req.body.name;
    let numberOfRooms = req.body.rooms;
    let codigoPostal = req.body.zipcode;
​
    if (!hotelName) {
        res.send('El nombre del hotel es necesario en el campo name');
    }
    // TODO validate if numberOfRooms is numeric
​
    pool.query(checkHotelNameExist, [hotelName], (error, result) => {
        if (result.rows.length === 0) {
            pool.query(createNewHotel, [hotelName, numberOfRooms, codigoPostal], (error, result) => {
                if (error) {
                    console.log(error);
                    res.send('Error al crear el hotel. Contacta con... ');
                } else {
                    res.json(`Hotel ${hotelName} created`)
                }
            })
        } else {
            res.send(`Hotel ${hotelName} ya existe en la base de datos`);
        }
    })
})