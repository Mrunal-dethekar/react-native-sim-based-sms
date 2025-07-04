package com.simbasedsms

import android.os.Build
import android.telephony.SmsManager
import android.telephony.SubscriptionManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.simbasedsms.NativeSimBasedSmsSpec

@ReactModule(name = SimBasedSmsModule.NAME)
class SimBasedSmsModule(reactContext: ReactApplicationContext) :
  NativeSimBasedSmsSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

    override fun sendSms(phoneNumber: String, message: String, simSlot: Double, promise: Promise) {
        // TurboModules pass numbers as Double, so we cast to Int
        val slot = simSlot.toInt()
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                val subscriptionManager = SubscriptionManager.from(reactApplicationContext)
                if (subscriptionManager.activeSubscriptionInfoCount > 1) {
                    val localList = subscriptionManager.activeSubscriptionInfoList
                    
                    if (localList != null) {
                        // Find the SIM info corresponding to the desired slot
                        val targetSim = localList.find { it.simSlotIndex == slot }

                        if (targetSim != null) {
                            // Use the subscription ID of the target SIM to get the correct SmsManager instance
                            SmsManager.getSmsManagerForSubscriptionId(targetSim.subscriptionId)
                                .sendTextMessage(phoneNumber, null, message, null, null)
                            promise.resolve("SMS sent successfully from SIM ${slot + 1}")
                        } else {
                            promise.reject("SIM_NOT_FOUND", "SIM slot $slot not found or is inactive.")
                        }
                    } else {
                        promise.reject("SIM_INFO_ERROR", "Could not retrieve SIM information list.")
                    }
                } else {
                    // If there's only one SIM, use the default SmsManager
                    SmsManager.getDefault().sendTextMessage(phoneNumber, null, message, null, null)
                    promise.resolve("SMS sent successfully (single SIM detected)")
                }
            } else {
                // For older Android versions, SIM selection is not supported, use default
                SmsManager.getDefault().sendTextMessage(phoneNumber, null, message, null, null)
                promise.resolve("SMS sent successfully (older Android version)")
            }
        } catch (e: Exception) {
            promise.reject("SMS_SEND_ERROR", e.message)
        }
    }

  companion object {
    const val NAME = "SimBasedSms"
  }
}
