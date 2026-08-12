import 'package:flutter/material.dart';

class HomePage extends StatefulWidget{
  HomePageState createState(){
    return HomePageState();
  }

}

class HomePageState extends State<HomePage>{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      body: Container(
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(colors:[
                  Colors.blueAccent,
                  Colors.greenAccent
                ])
              ),
            ), // container    
          ], //children
        ), // stack
      ), // container
    );
  }
}