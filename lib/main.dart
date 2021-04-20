import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';

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

  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 15.0, fontWeight: FontWeight.bold, color: Colors.red);
  static const List<Widget> _widgetOptions = <Widget>[
    Text(
      'Home : 0',
      style: optionStyle,
    ),
    Text(
      'Business : 1',
      style: optionStyle,
    ),
    Text(
      'School : 2',
      style: optionStyle,
    ),
    Text(
      'Settings : 3',
      style: optionStyle,
    ),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedItemColor: Colors.amber[800],
      ),
      appBar: AppBar(
        title: Text(widget.title),
        elevation: 6.0,
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
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
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;

    });
  }
}
