// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
    
    function searchPP() {
        var policy = chrome.extension.getBackgroundPage();
        document.addEventListener('click', function () {
            window.close();
          });
}

window.onload = searchPP;
