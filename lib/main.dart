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
        child: Icon(Icons.minimize),
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
            TextButton(
              onPressed: () {
                  showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          titlePadding: EdgeInsets.all(10.0),
          backgroundColor: Colors.lightBlue,
          insetPadding: EdgeInsets.all(20.0),
          contentTextStyle: TextStyle(color: Colors.blue),
          title: Text('Contact Info'),
          content: Text('mail us at: maail@nextingo.in'),
          actions: <Widget>[],
        );
      });
              },
              child: Text('Contact'),
            ),
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
            OutlinedButton(
              onPressed: () {},
              child: Text(
                'Outlined Button',
                style: GoogleFonts.roboto(
                  fontSize: 20.0,
                ),
              ),
              autofocus: true,
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
