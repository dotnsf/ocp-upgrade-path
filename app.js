//. app.js
var fs = require( 'fs' );
var axios = require( 'axios' );

async function fetch_url( url ){
  return new Promise( async ( resolve, reject ) => {
    //console.log( '> fetch_url: url=' + url );
    var headers = {
      headers: {
        accept: 'text/plain'
      }
    };

    try{
      var r = await axios.get( url, {}, headers );
      //console.log( r );
      if( r && r.data ){
        resolve( '' + r.data );
      }else{
        resolve( null );
      }
    }catch( e ){
      console.log( e );
      reject( e );
    }
  });
}

async function find_oldest_path( target, current ){
  return new Promise( async ( resolve, reject ) => {
    var path = '';
    var release_url = release_txt_url( target );
    var txt = await fetch_url( release_url );
    
    var n1 = txt.indexOf( 'Upgrades:', 0 );
    if( n1 > -1 ){
      var n2 = txt.indexOf( '\n', n1 + 9 );
      if( n2 > -1 ){
        var upgrades = txt.substring( n1 + 9, n2 );
        //console.log( '> find_oldest_path: target=' + target + ', upgrades=' + upgrades );
        var versions = upgrades.split( ',' );

        //. まず current が存在しているかを確認
        if( current ){
          for( var i = 0; i < versions.length && !path; i ++ ){
            var v = versions[i].trim();
            if( v == current ){
              path = current;
            }
          }
        }

        //. current が存在していなかった場合に **current よりも大きい** 直近バージョンを探す
        if( !path ){
          var b = true;
          for( var i = versions.length - 1; i >= 0 && b; i -- ){
            var v = versions[i].trim().split( '.' );
            if( v.length == 3 ){  //. xx.xx.xx
              var b0 = true;
              for( var j = 0; j < v.length && b0; j ++ ){
                var b1 = true;
                for( var k = 0; k < v[j].length && b1; k ++ ){
                  var c = v[j].charAt( k );
                  b1 = ( '0' <= c ) && ( c <= '9' );
                }
                b0 = b1;
              }

              //. 全て数字のバージョンのみ
              if( b0 ){
                //. versions[i].trim() が current よりも大きいバージョンの場合のみ候補にする
                var v0 = current.split( '.' );
                var b1 = false;
                if( parseInt( v0[0] ) < parseInt( v[0] ) ){
                  b1 = true;
                }else if( parseInt( v0[0] ) == parseInt( v[0] ) ){
                  if( parseInt( v0[1] ) < parseInt( v[1] ) ){
                    b1 = true;
                  }else if( parseInt( v0[1] ) == parseInt( v[1] ) ){
                    if( parseInt( v0[2] ) < parseInt( v[2] ) ){
                      b1 = true;
                    }
                  }
                }

                if( b1 ){
                  path = versions[i].trim();
                }else{
                  b = false;
                } 
              }
            }
          }
        }
      }
    }

    //. path == '' の場合は「見つからない」
    resolve( path );
  });
}

function release_txt_url( version ){
  return 'https://mirror.openshift.com/pub/openshift-v4/clients/ocp/' + version + '/release.txt';
}

async function find_path( currentversion, targetversion ){
  return new Promise( async ( resolve, reject ) => {
    console.log( 'currentversion = ' + currentversion );
    console.log( 'targetversion = ' + targetversion );
    console.log( '' );

    var results = [ targetversion ];
    var path = await find_oldest_path( targetversion, currentversion );
    do{
      if( path ){
        if( path == currentversion ){
          path = null;
        }else{
          results.unshift( path );
          path = await find_oldest_path( path, currentversion );
        }
      }else{
        results.unshift( '(impossible)' );
      }
    }while( path );

    results.unshift( currentversion );
    resolve( results );
  });
}


if( process.argv.length < 4 ){
  console.log( 'Usage: $ node app (currentversion) (targetversion)' );
  console.log( ' currentversion: Current OCP version' );
  console.log( ' targetversion: Target OCP version' );
}else{
  var currentversion = process.argv[2];
  var targetversion = process.argv[3];

  find_path( currentversion, targetversion ).then( async function( results ){
    console.log( results.join( ' -> ' ) );
  });
}