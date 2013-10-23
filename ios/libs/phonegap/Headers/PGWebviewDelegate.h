//
//  PGWebviewDelegate.h
//  PhoneGapLib
//
//  Created by Wei Li on 23/05/2012.
//  Copyright (c) 2012 FeedHenry. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class InvokedUrlCommand;
@class PGWhitelist;

@interface PGWebviewDelegate : NSObject
{
}

@property (nonatomic, readwrite, retain) IBOutlet UIWebView *webView;
@property (nonatomic, readwrite, retain) NSMutableDictionary *pluginObjects;
@property (nonatomic, readwrite, retain) NSDictionary *pluginsMap;
@property (nonatomic, readwrite, retain) NSDictionary *settings;
@property (nonatomic, readwrite, retain) NSString *sessionKey;
@property (nonatomic, readwrite, retain) PGWhitelist* whitelist; // readonly for public
@property (readwrite, assign) BOOL loadFromString;
@property (readwrite, assign) BOOL inChildWebview;
@property (readwrite, retain) UIViewController * viewController;
@property (nonatomic, readwrite, retain) UIWebView *parentWebview;

+ (NSDictionary*)getBundlePlist:(NSString *)plistName;
+ (NSString*) wwwFolderName;
+ (NSString*) pathForResource:(NSString*)resourcepath;
+ (NSString*) phoneGapVersion;
+ (NSString*) applicationDocumentsDirectory;
+ (NSString*) startPage;
+ (BOOL) isIPad;

- (id) initWithWebView:(UIWebView *) theWebView sessionKey:(NSString*) theSessionKey;
- (BOOL)loadSettings;
- (int)executeQueuedCommands;
- (void)flushCommandQueue;


- (id) getCommandInstance:(NSString*)pluginName;
- (void) javascriptAlert:(NSString*)text;
- (BOOL) execute:(InvokedUrlCommand*)command;
- (NSString*) appURLScheme;
- (NSDictionary*) deviceProperties;

- (void)webViewDidFinishLoad:(UIWebView *)theWebView;
- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error;
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;


@end

@interface NSDictionary (LowercaseKeys)

- (NSDictionary*) dictionaryWithLowercaseKeys;

@end
