package com.feedhenry.decoupled;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.view.Menu;
import org.apache.cordova.*;

public class MainActivity extends DroidGap {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    super.setIntegerProperty("loadUrlTimeoutValue", 60000);
    System.out.println("isTablet: " + isTablet());
    if (isTablet()){
    	super.loadUrl("file:///android_asset/www/tablet/index.html");
    }else{
    	super.loadUrl("file:///android_asset/www/phone/index.html");
    }
  }
    

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.activity_main, menu);
    return true;
  }
  
  private boolean isTablet() {
	  	Context context = getContext();
	    boolean xlarge = ((context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == 4);
	    boolean large = ((context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE);
	    return (xlarge || large);
	}


}
