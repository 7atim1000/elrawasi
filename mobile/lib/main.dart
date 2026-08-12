import 'package:flutter/material.dart';
import 'package:mobile/HomePage.dart';

void main() {
  runApp(Myapp()); // that generated import 'package:flutter/material.dart'

}

class Myapp extends StatelessWidget{

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Shop",
      home: HomePage(),
    );
  }
}