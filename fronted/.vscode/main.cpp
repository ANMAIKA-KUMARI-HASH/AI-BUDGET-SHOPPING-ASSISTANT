# include<stdio.h>
# include<iostream>
#include<vector>
using namespace std;
int main(){
    int a=10;
    int *ptr=&a;
    cout<<ptr;
    cout<<&a<<endl;
    return 0;

}