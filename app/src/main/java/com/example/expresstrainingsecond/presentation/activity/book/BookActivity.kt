package com.example.expresstrainingsecond.presentation.activity.book

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.lifecycle.ViewModelProvider
import com.example.expresstrainingsecond.R
import com.example.expresstrainingsecond.databinding.ActivityBookBinding
import com.example.expresstrainingsecond.domain.models.WebViewItems
import com.example.expresstrainingsecond.domain.repository.BookRepository
import com.example.expresstrainingsecond.presentation.adapters.SideMenuAdapter
import com.example.expresstrainingsecond.presentation.adapters.ViewPagerAdapter

class BookActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBookBinding
    private lateinit var viewModel: BookActivityViewModel
    private lateinit var viewPagerAdapter: ViewPagerAdapter
    private lateinit var sideMenuAdapter: SideMenuAdapter
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBookBinding.inflate(layoutInflater)
        toggle = ActionBarDrawerToggle(this, binding.drawerLayout, R.string.open, R.string.close)

        setContentView(binding.root)

        initBookActivity()

        val webViewItems = viewModel.getWebViewItems(this)

        setupSideMenu(toggle)
        setupViewPager(webViewItems)

    }



    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (toggle.onOptionsItemSelected(item)) {
            return true
        }
        return super.onOptionsItemSelected(item)
    }


    private fun setupViewPager(
        webViewItems: MutableList<WebViewItems>
    ) {
        viewPagerAdapter = ViewPagerAdapter(webViewItems)
        binding.viewPager.adapter = viewPagerAdapter

    }


    private fun setupSideMenu(toggle: ActionBarDrawerToggle) {
        val items = viewModel.getLinearSideMenuItems(this)

        binding.drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        sideMenuAdapter = SideMenuAdapter(items)
        binding.rvSideMenu.adapter = sideMenuAdapter

        sideMenuAdapter.setOnItemClickListener {
            binding.viewPager.setCurrentItem(items.indexOf(it))
        }

    }



    private fun initBookActivity() {
        val repository = BookRepository()
        val viewModelProviderFactory = BookActivityViewModelProviderFactory(repository)
        viewModel = ViewModelProvider(this, viewModelProviderFactory).get(BookActivityViewModel::class.java)
    }
}