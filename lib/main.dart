import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> f448d05b01b2616e22a8fdfe03a806601b8d8cd9
void alterfunction(BuildContext context) {
  showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
<<<<<<< HEAD
          titlePadding: EdgeInsets.all(10.0),
          backgroundColor: Colors.lightBlue,
          insetPadding: EdgeInsets.all(20.0),
          contentTextStyle: TextStyle(color: Colors.blue),
          title: Text('Contact Info'),
          content: Text('mail us at: maail@nextingo.in'),
          actions: <Widget>[],
=======
          title: Text('Contact Info'),
          content: Text('mail us at: maail@nextingo.in'),
          actions: <Widget>[
            FlatButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Close'),
            ),
          ],
>>>>>>> f448d05b01b2616e22a8fdfe03a806601b8d8cd9
        );
      });
}

<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> f448d05b01b2616e22a8fdfe03a806601b8d8cd9
class _MyHomePageState extends State<MyHomePage> {
  int counter = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        elevation: 6.0,
      ),
      body: Center(
        child: ListView(
          padding: EdgeInsets.all(10.0),
          children: <Widget>[
<<<<<<< HEAD
<<<<<<< Updated upstream
            Text(
              '$counter',
              style: GoogleFonts.roboto(
                fontSize: 30.0,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
=======
            TextButton(
              onPressed: () {
                alterfunction(context);
              },
              child: Text('Contact'),
            ),
=======
            TextButton(onPressed: (), child: child)
>>>>>>> f448d05b01b2616e22a8fdfe03a806601b8d8cd9
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: Container(
                padding: EdgeInsets.all(20.0),
                height: 200.0,
                width: MediaQuery.of(context).size.width,
                child: Text(
                  'Container 1',
                  style: GoogleFonts.roboto(
                    fontSize: 20.0,
                  ),
                ),
                margin: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20.0),
                  color: Colors.amberAccent,
                  border: Border.all(
                      width: 1.0,
                      color: Colors.black,
                      style: BorderStyle.solid),
<<<<<<< HEAD
                ),
>>>>>>> Stashed changes
              ),
            ),
            RaisedButton(
              color: Colors.amber,
              onPressed: () {
                setState(() {
                  counter = counter + 1;
                });
                print('Raised button clicked');
              },
              child: Text(
                'Click Raised Button',
                style: GoogleFonts.roboto(
                  fontSize: 20,
                  color: Colors.black,
=======
>>>>>>> f448d05b01b2616e22a8fdfe03a806601b8d8cd9
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: Container(
                height: 200.0,
                width: MediaQuery.of(context).size.width,
                child: Text(
                  'Container 2',
                  style: GoogleFonts.roboto(
                    fontSize: 20.0,
                  ),
                ),
                decoration: BoxDecoration(
                  color: Colors.blueAccent,
                  border: Border.all(width: 1.0, color: Colors.black),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: Container(
                height: 200.0,
                width: MediaQuery.of(context).size.width,
                child: Text(
                  'Container 3',
                  style: GoogleFonts.roboto(
                    fontSize: 20.0,
                  ),
                ),
                decoration: BoxDecoration(
                  color: Colors.deepOrangeAccent,
                  border: Border.all(width: 1.0, color: Colors.black),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
