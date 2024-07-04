package com.FCM.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
     @Override
    public void onBackPressed() {
        // Perform any necessary logic based on the back button press
        // If you want to navigate back in the app's WebView history
        if (this.bridge.getWebView().canGoBack()) {
            this.bridge.getWebView().goBack();
        } else {
            super.onBackPressed();
        }
    }
}
