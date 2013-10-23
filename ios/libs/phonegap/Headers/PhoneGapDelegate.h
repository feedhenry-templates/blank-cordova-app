/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */

#import <UIKit/UIKit.h>
#import "JSONKit.h"
#import "PGWebviewDelegate.h"

@class InvokedUrlCommand;
@class PhoneGapViewController;
@class Sound;
@class Contacts;
@class Console;
@class PGWhitelist;

@interface PhoneGapDelegate : NSObject <UIApplicationDelegate, UIWebViewDelegate>
{
}

@property (nonatomic, readwrite, retain) IBOutlet UIWindow *window;
@property (nonatomic, readwrite, retain) IBOutlet UIWebView *webView;
@property (nonatomic, readonly, retain) IBOutlet PhoneGapViewController *viewController;
@property (nonatomic, readonly, retain) IBOutlet UIActivityIndicatorView *activityView;
@property (nonatomic, readonly, retain) UIImageView *imageView;
@property (nonatomic, readonly, retain) NSDictionary *launchNotification; 
@property (nonatomic, readonly, retain) PGWebviewDelegate *pgWebViewDelegate;
@property (nonatomic, readonly, retain) NSString *sessionKey; 

+ (NSDictionary*)getBundlePlist:(NSString *)plistName;
+ (NSString*) wwwFolderName;
+ (NSString*) pathForResource:(NSString*)resourcepath;
+ (NSString*) applicationDocumentsDirectory;
+ (NSString*) startPage;


- (id) getCommandInstance:(NSString*)pluginName;
- (void) javascriptAlert:(NSString*)text;
- (NSString*) appURLScheme;
- (NSDictionary*) deviceProperties;

- (void)applicationDidEnterBackground:(UIApplication *)application;
- (void)applicationWillEnterForeground:(UIApplication *)application;
- (void)applicationWillResignActive:(UIApplication *)application;
- (void)applicationWillTerminate:(UIApplication *)application;

@end

