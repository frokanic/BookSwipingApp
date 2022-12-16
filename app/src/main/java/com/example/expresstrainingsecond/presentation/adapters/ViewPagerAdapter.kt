package com.example.expresstrainingsecond.presentation.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.recyclerview.widget.RecyclerView
import com.example.expresstrainingsecond.databinding.ItemViewPagerBinding
import com.example.expresstrainingsecond.domain.models.WebViewItems
import com.example.readerexpresspub.util.Constants.filePathForWebView


class ViewPagerAdapter(
    val pages: List<WebViewItems>
): RecyclerView.Adapter<ViewPagerAdapter.ViewPagerViewHolder>() {

    private lateinit var webView: WebView

    inner class ViewPagerViewHolder(val binding: ItemViewPagerBinding):
        RecyclerView.ViewHolder(binding.root)


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewPagerViewHolder {
        return ViewPagerViewHolder(ItemViewPagerBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )
    }


    override fun onBindViewHolder(holder: ViewPagerViewHolder, position: Int) {
        val binding = holder.binding
        val currentPage = pages[position].href
        holder.itemView.apply {
            webView = binding.webview
            webView.webViewClient = WebViewClient()
            webView.loadUrl(filePathForWebView + currentPage)
            webView.settings.javaScriptEnabled = true
            webView.settings.setSupportZoom(true)
            webView.setInitialScale(1)
        }
    }



    override fun getItemCount(): Int {
        return pages.size
    }
}

