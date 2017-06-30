package com.hslfiproto;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.mackentoch.beaconsandroid.BeaconsAndroidPackage;
import com.oblongmana.webviewfileuploadandroid.AndroidWebViewPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.novadart.reactnativenfc.ReactNativeNFCPackage;
import im.shimo.react.cookie.CookieManagerPackage;
import com.hslfiproto.BuildConfig;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BackgroundJobPackage(),
            new BeaconsAndroidPackage(),
            new AndroidWebViewPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new RCTCameraPackage(),
            new ReactNativeNFCPackage(),
            new CookieManagerPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
