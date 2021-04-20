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
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int counter = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            counter = counter - 1;
          });
          print('Floating button clicked $counter');
        },
        child: Icon(Icons.wifi),
        foregroundColor: Colors.black,
        backgroundColor: Colors.yellow,
        elevation: 6.0,
        focusColor: Colors.amber,
      ),
      appBar: AppBar(
        title: Text(widget.title),
        elevation: 6.0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              '$counter',
              style: GoogleFonts.roboto(
                fontSize: 30.0,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
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
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                print('Elevated button clicked');
              },
              child: Text(
                'Click Elevated Button',
              ),
            ),
            IconButton(
              onPressed: () {
                print('Icon Button Clicked');
              },
              icon: Icon(Icons.favorite_border_sharp),
            ),
            OutlineButton(
              onPressed: () {},
              child: Text(
                'Outlined Button',
                style: GoogleFonts.roboto(
                  fontSize: 20.0,
                ),
              ),
              focusColor: Colors.blue,
              hoverColor: Colors.blue,
            ),
            TextButton(
              onPressed: () {},
              child: Text(
                'Text Button',
                style: GoogleFonts.roboto(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
