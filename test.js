var numbers = [
    "+77172505350",
    "+71234567890",
    "1234567890",
    "234567890",
    "34567890",
    "4567890",
    "567890",
    "67890",
    "7890",
    "890",
    "90",
    "0"
]

var re = /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/;

for( var i = 0; i < numbers.length; i++ ) {
    var formatted = numbers[ i ].replace( re, function( all, a, b, c, d, e ){
        return ( a ? a + " " : "" ) + ( b ? b + " " : "" ) + ( c ? c + "-" : "" ) + ( d ? d + "-" : "" ) + e;
    });

    console.log( formatted  );
}


function humanNumber( number ) {
    const re = /(?:([\d]{1,}?))??(?:([\d]{1,3}?))??(?:([\d]{1,3}?))??(?:([\d]{2}))??([\d]{2})$/;
    number.replace( re,
        ( all, a, b, c, d, e ) => ( a ? a + " " : "" ) + ( b ? b + " " : "" ) + ( c ? c + "-" : "" ) + ( d ? d + "-" : "" ) + e
    );
}
